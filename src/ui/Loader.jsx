function Loader() {
  // Doing inset=0 means it will take full space. ( i.e. top=left=right=bottom=0 ) BUT background-colorwill hide the MENU then so 200/20 means with "20% opacity".
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-200/20 backdrop:blur-sm">
      <div className="loader"></div>
    </div>
  );
}

export default Loader;
