const IframeComponent = ({ url,title }) => {

  return(
    <div className="iframe-container">
        <iframe
            src={url}
            title={title}
            width="100%"
            height="600"
        ></iframe>
    </div>
  )
};

export default IframeComponent;