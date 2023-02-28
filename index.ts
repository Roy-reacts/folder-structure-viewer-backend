import express, { Request, Response } from 'express';
import mongoose , { ConnectOptions } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Folder from './models/Folder';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

const options: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }as ConnectOptions;
mongoose.connect(MONGO_URI,options);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.log('Failed to connect to MongoDB:', error);
});

app.get('/api/folders', async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch folders' });
  }
});

app.post('/api/folders', async (req: Request, res: Response) => {
  const { name, parent } = req.body;
  try {
    const folder = new Folder({ name, parent });
    const savedFolder = await folder.save();
    res.json(savedFolder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create folder' });
  }
});

app.delete('/api/folders/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    if (!folder.parent) {
      return res.status(400).json({ message: 'Cannot delete root folder' });
    }
    await Folder.deleteMany({ parent: id });
    await folder.delete();
    res.json({ message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete folder' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
