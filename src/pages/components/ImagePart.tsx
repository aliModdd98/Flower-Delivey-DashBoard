const ImagePart = ({ image }: { image: string }) => {
    return (
      <div className="aj-img-container w-full h-full">
        <img src={image} alt="flower" className="w-full h-full object-cover" />
      </div>
    );
  };
  
  export default ImagePart;
  