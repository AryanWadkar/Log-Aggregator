import styles from './navbar.module.css'
import { MdRefresh } from "react-icons/md";

function Navbar({ setActiveSection,onReload,currActive }) {

  const ebtn=currActive==='entries'? `${styles.btn} ${styles.active}` : `${styles.btn} ${styles.inactive}`;
  const gbtn=currActive==='graphs'? `${styles.btn} ${styles.active}` : `${styles.btn} ${styles.inactive}`;

    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarleft}>
          <span>VestigeV</span>
          <div onClick={() => setActiveSection('entries')} className={ebtn}>Entries</div>
          <div onClick={() => setActiveSection('graphs')} className={gbtn}>Graphs</div>
        </div>
        <div className={styles.navbarright}>
          <MdRefresh onClick={onReload}/>
        </div>
      </nav>
    );
}

export default Navbar;
  
  
  
  