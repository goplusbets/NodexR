import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

function Dashboard({ role, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <Sidebar handleLogout={handleLogout} username={sessionStorage.getItem('username')} />


      <div className="content p-3">
        {role === "Admin" && (
          <div className="admin-section rounded p-3 bg-dark">
            <h5>Admin</h5>
            <Link to="/create-user" className="btn btn-light btn-sm mb-2 w-100" style={{ color: '#1f2d3d' }}>
              Stwórz nowego użytkownika
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;





// import ContentHeader from "./contentHeader";

// const Dashboard = () => {
//   return (
//     <div>
//       <ContentHeader title="Dashboard" />

//       <section className="content">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-3 col-6">
//               <div className="small-box bg-info">
//                 <div className="inner">
//                   <h3>150</h3>

//                   <p>New Orders</p>
//                 </div>
//                 <div className="icon">
//                   <i className="ion ion-bag" />
//                 </div>
//                 <a href="/" className="small-box-footer">
//                   More info <i className="fas fa-arrow-circle-right" />
//                 </a>
//               </div>
//             </div>
//             <div className="col-lg-3 col-6">
//               <div className="small-box bg-success">
//                 <div className="inner">
//                   <h3>
//                     53<sup style={{ fontSize: '20px' }}>%</sup>
//                   </h3>

//                   <p>Bounce Rate</p>
//                 </div>
//                 <div className="icon">
//                   <i className="ion ion-stats-bars" />
//                 </div>
//                 <a href="/" className="small-box-footer">
//                   More info <i className="fas fa-arrow-circle-right" />
//                 </a>
//               </div>
//             </div>
//             <div className="col-lg-3 col-6">
//               <div className="small-box bg-warning">
//                 <div className="inner">
//                   <h3>44</h3>

//                   <p>User Registrations</p>
//                 </div>
//                 <div className="icon">
//                   <i className="ion ion-person-add" />
//                 </div>
//                 <a href="/" className="small-box-footer">
//                   More info <i className="fas fa-arrow-circle-right" />
//                 </a>
//               </div>
//             </div>
//             <div className="col-lg-3 col-6">
//               <div className="small-box bg-danger">
//                 <div className="inner">
//                   <h3>65</h3>

//                   <p>Unique Visitors</p>
//                 </div>
//                 <div className="icon">
//                   <i className="ion ion-pie-graph" />
//                 </div>
//                 <a href="/" className="small-box-footer">
//                   More info <i className="fas fa-arrow-circle-right" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Dashboard;