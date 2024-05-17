import React from "react";

const PartApiCont = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '60vw', margin: '0 auto', background: 'rgba(24, 24, 28, 0.85)', position: 'relative', marginBottom: '100px' }}>
      <div style={{ textAlign: 'center', paddingTop: '2vh' }}>
        <div style={{ color: 'white', fontSize: 48, fontFamily: 'Poppins', fontWeight: '600', lineHeight: '64px', wordWrap: 'break-word' }}>
          API`s we partner with
        </div>
        <img src="https://www.drupal.org/files/project-images/logo_191.png" alt="Partner Logo" style={{ marginTop: '2vh', maxHeight: '20vh' }} />
      </div>
    </div>
  );
};

export default PartApiCont;