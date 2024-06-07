import { footerData } from "@/data/footer";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary bg-primary-text footer-container">
      <div className="max-width footer-grid">
        <h5 className="mb-4"> E-SCoPe </h5>

        <div className="footer-items-container">
          {footerData.map((data) => (
            <div className="footer-item">
              <h6 className="footer-item-title"> {data.title} </h6>
              <div className="footer-item-links">
                {data.links.map((link) => (
                  <a href={link.link}> {link.label} </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
