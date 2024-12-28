interface CustomFile extends Express.Multer.File {
  location: string;
  bucket: string;
  key: string;
}

export default CustomFile