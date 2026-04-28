import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
  const adContainer = useRef(null);

  useEffect(() => {
    if (adContainer.current && !adContainer.current.firstChild) {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(toe){
          var d = document,
              s = d.createElement('script'),
              l = d.scripts[d.scripts.length - 1];
          s.settings = toe || {};
          s.src = "\\/\\/shameful-farm.com\\/b.XsVds_dcGGlZ0aYEW\\/ci\\/feDmb9hufZnUDlOkBPkTLYE5\\/OiTcYK3nMbz\\/MftKNSjBkC5\\/N\\/jacWzgN\\/wU";
          s.async = true;
          s.referrerPolicy = 'no-referrer-when-downgrade';
          l.parentNode.insertBefore(s, l);
        })({})
      `;
      adContainer.current.appendChild(script);
    }
  }, []);

  return (
    <div className="ad-banner-container my-4 text-center">
      <div 
        ref={adContainer} 
        style={{ minHeight: '100px', display: 'flex', justifyContent: 'center' }}
      >
        {/* Ad will load here */}
      </div>
      <div className="small text-muted mt-1" style={{ fontSize: '10px', letterSpacing: '1px' }}>ADVERTISEMENT</div>
    </div>
  );
};

export default AdBanner;
