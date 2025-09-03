import type { VercelRequest, VercelResponse } from '@vercel/node';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

async function convertObjToBlockbench(objContent: string, fileName: string) {
  const lines = objContent.split('\n').map(line => line.trim()).filter(line => line);
  
  const vertices: [number, number, number][] = [];
  const faces: number[][] = [];
  
  // Parse OBJ content
  for (const line of lines) {
    if (line.startsWith('v ')) {
      const coords = line.slice(2).split(/\s+/).map(Number);
      if (coords.length >= 3) {
        vertices.push([coords[0], coords[1], coords[2]]);
      }
    } else if (line.startsWith('f ')) {
      const faceData = line.slice(2).split(/\s+/).map(part => {
        const vertexIndex = parseInt(part.split('/')[0]);
        return vertexIndex > 0 ? vertexIndex - 1 : vertices.length + vertexIndex;
      });
      faces.push(faceData);
    }
  }

  if (vertices.length === 0) {
    throw new Error("No vertices found in OBJ file");
  }

  // Convert to Blockbench format
  const modelName = fileName.replace('.obj', '').replace(/[^a-zA-Z0-9_]/g, '_');
  
  // Calculate bounding box for the model
  const bounds = calculateBounds(vertices);
  const center = [
    (bounds.min[0] + bounds.max[0]) / 2,
    (bounds.min[1] + bounds.max[1]) / 2,
    (bounds.min[2] + bounds.max[2]) / 2
  ];
  
  // Scale vertices to reasonable Minecraft dimensions
  const scale = Math.min(16 / Math.max(
    bounds.max[0] - bounds.min[0],
    bounds.max[1] - bounds.min[1],
    bounds.max[2] - bounds.min[2]
  ), 1);

  const scaledVertices = vertices.map(v => [
    (v[0] - center[0]) * scale,
    (v[1] - center[1]) * scale,
    (v[2] - center[2]) * scale
  ]);

  // Create simplified cube representation
  const cubes = createCubesFromVertices(scaledVertices, faces);

  const blockbenchData = {
    format_version: "1.10.0",
    [`geometry.${modelName}`]: {
      texturewidth: 64,
      textureheight: 64,
      visible_bounds_width: Math.ceil((bounds.max[0] - bounds.min[0]) * scale / 8),
      visible_bounds_height: Math.ceil((bounds.max[1] - bounds.min[1]) * scale / 8),
      visible_bounds_offset: [0, Math.ceil((bounds.max[1] - bounds.min[1]) * scale / 16), 0],
      bones: [
        {
          name: "root",
          pivot: [0, 0, 0]
        },
        {
          name: modelName,
          parent: "root",
          pivot: [0, 0, 0],
          cubes: cubes
        }
      ]
    }
  };

  return {
    fileName: `${modelName}.json`,
    content: JSON.stringify(blockbenchData, null, 2),
    size: JSON.stringify(blockbenchData).length,
  };
}

function calculateBounds(vertices: [number, number, number][]) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  
  for (const vertex of vertices) {
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], vertex[i]);
      max[i] = Math.max(max[i], vertex[i]);
    }
  }
  
  return { min: min as [number, number, number], max: max as [number, number, number] };
}

function createCubesFromVertices(vertices: number[][], faces: number[][]): any[] {
  if (vertices.length === 0) return [];

  const bounds = calculateBounds(vertices as [number, number, number][]);
  
  const width = Math.max(1, Math.ceil(bounds.max[0] - bounds.min[0]));
  const height = Math.max(1, Math.ceil(bounds.max[1] - bounds.min[1]));
  const depth = Math.max(1, Math.ceil(bounds.max[2] - bounds.min[2]));
  
  return [
    {
      origin: [bounds.min[0], bounds.min[1], bounds.min[2]],
      size: [width, height, depth],
      uv: [0, 0]
    }
  ];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse multipart form data manually since Vercel doesn't support multer directly
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ message: 'Content-Type must be multipart/form-data' });
    }

    // For now, we'll use a simplified approach
    // In production, you'd need to parse the multipart data properly
    const body = req.body;
    
    if (!body || !body.objFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const startTime = Date.now();
    const objContent = body.objFile.content || body.objFile;
    const fileName = body.objFile.originalname || 'model.obj';
    
    // Parse OBJ file and convert to Blockbench format
    const convertedData = await convertObjToBlockbench(objContent, fileName);
    const endTime = Date.now();
    const conversionTime = ((endTime - startTime) / 1000).toFixed(1) + 's';

    res.json({
      success: true,
      data: convertedData,
      conversionTime,
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Conversion failed" 
    });
  }
}