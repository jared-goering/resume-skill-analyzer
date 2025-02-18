import { useDropzone } from "react-dropzone";
import { Upload } from "@phosphor-icons/react";

interface MyDropzoneProps {
  file: File | null;              // <-- Now we accept `file` as a prop
  setFile: (file: File | null) => void;
}

export default function MyDropzone({ file, setFile }: MyDropzoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"]
    }
  });

  // Shrink padding if a file is already uploaded
  const dropzonePadding = file ? "p-4" : "p-8";

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed border-[#0095E8] rounded-md 
                  bg-[#E5F4FD] text-center cursor-pointer transition-colors 
                  hover:bg-[#CFECFE] flex flex-col items-center dark:bg-[#2B374B] dark:border-[#0095E8]
                  ${dropzonePadding}`}
    >
      <input {...getInputProps()} />

      {file ? (
        // A file is already uploaded — show just the name
        <p className="text-blue-600 text-sm font-medium">
          {file.name}
        </p>
      ) : isDragActive ? (
        <p className="text-blue-600">Drop the file here...</p>
      ) : (
        <>
          <Upload className="mb-2 text-blue-500" size={26} />
          <p className="text-blue-500">Drop files here</p>
        </>
      )}
    </div>
  );
}