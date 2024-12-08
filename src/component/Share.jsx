import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import { useState } from 'react';

function BlogShare({ blogTitle, blogUrl,close }) {
  const [copied, setCopied] = useState(false);  
  const customMessage = `Check out this amazing blog: "${blogTitle}"! Read more here:`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-300 rounded-lg shadow-lg w-52 h-fit">
      <i className="ph-light ph-x text-xl font-bold text-red-400 hover:text-red-500 absolute top-4 right-3" onClick={()=>close(false)}></i>
      <h3 className="text-lg font-semibold text-gray-700">Share this blog:</h3>

      <div className="flex gap-4">
        <FacebookShareButton url={blogUrl} quote={customMessage}>
          <FacebookIcon size={32} round className="hover:opacity-80" />
        </FacebookShareButton>

        <TwitterShareButton url={blogUrl} title={customMessage}>
          <TwitterIcon size={32} round className="hover:opacity-80" />
        </TwitterShareButton>

        <WhatsappShareButton url={blogUrl} title={customMessage} separator=" - ">
          <WhatsappIcon size={32} round className="hover:opacity-80"  />
        </WhatsappShareButton>

        <button
          onClick={handleCopyToClipboard}
          className={`p-2 rounded-full transition-colors duration-200 ease-in-out bg-white text-black hover:bg-gray-300`}
          title="Copy to clipboard"
        >
          {copied?<i className="ph-light ph-check-fat text-2xl"></i>:<i className="ph-light ph-clipboard-text text-2xl"></i>}
          
        </button>
      </div>

    </div>
  );
}

export default BlogShare;
