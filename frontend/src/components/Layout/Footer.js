import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <div className="footer text-lg-start bottom">
            <hr className="mt-5" />
            <div className="container p-1">
                <div className="row">
                    <div className="col-lg-3">
                        <h5 className="text-uppercase">Play Store</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/7" className="link-no-underline">Redeem</Link></li>
                            <li><Link to="/7" className="link-no-underline">Refund Policy</Link></li>
                            <li><Link to="/7" className="link-no-underline">FAQs</Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-3 ">
                        <h5 className="text-uppercase">Children and Family</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/7" className="link-no-underline">Parent guide</Link></li>
                            <li><Link to="/7" className="link-no-underline">Family sharing</Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-3 ">
                        <h5 className="text-uppercase">            </h5>
                        <ul className="list-unstyled">
                            <li><Link to="/7" className="link-no-underline">              </Link></li>
                            <li><Link to="/7" className="link-no-underline">              </Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-3">
                        <ul className="list-unstyled">
                            <li>  <img src={require('../../Images/back playstore.png')} alt="Google Play Store Logo" className="img-fluid" width="250" /></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center p-2 list-unstyled" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <Link to="/7" className="link-no-underline">Terms of service</Link> |
                <Link to="/7" className="link-no-underline"> Policy</Link> |
                <Link to="/7" className="link-no-underline"> About Play Store</Link> |
                <Link to="/7" className="link-no-underline">Developers</Link> |
                <Link to="/7" className="link-no-underline "> All prices include GST.</Link>
            </div>
        </div>
    );
};

export default Footer;