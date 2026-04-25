import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div class="pricing">
      
    <div class="pricing-container">
  <div class="header">
   Free
  </div>
  {/* <div class="price">
    <span>
      <sup class="currency">$</sup><span class="figure">39</span> <sup class="cent">99</sup> <sup class="frequency">monthly</sup>
    </span>
    <div class='details'>based on 1 yr</div>
  </div> */}
<div class="itemsWrapper">
  <ul class="items">
    {/* <li class='item'>Full Access</li> */}
    <li class="item"><b>Carrer Roadmap</b></li>
    <li class="item">1:1 Session</li>
        <li class="item">Webinar</li>
    <li class="item">Tutorial Video</li>
    <li class="item">Industry Project</li>
    <li class="item">Resume Building</li>
    <li class="item">Apply For Internship and Job</li>


  </ul>
</div>
</div>
</div>
  );
}

export default Pricing;
