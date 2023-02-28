import mongoose from 'mongoose';

type FolderType = {
  name: string;
  parent?: string;
  children?: FolderType[];
};

type FolderDocument = mongoose.Document & FolderType
const folderSchema = new mongoose.Schema<FolderDocument>({
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
  });
  
  const Folder = mongoose.model<FolderDocument>('Folder', folderSchema);
  
  export default Folder;
  