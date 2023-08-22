// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
// import Label from '../../../components/Label';
// import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';
import {decodeJWT} from "../../../contexts/JWTContext"
// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
};

export const navConfig = ()=>{ 
  const user = decodeJWT( localStorage.getItem('accessToken') )
  if(user){
    if(user.role === 0){
      // ADMIN
      return [
        // GENERAL
        // ----------------------------------------------------------------------
        {
          subheader: 'general',
          items: [
            { title: 'dashboard', path: '/dashboard', icon: ICONS.dashboard },
          ],
        },
      
        // MASTER DATA
        // ----------------------------------------------------------------------
        {
          subheader: 'master data',
          items: [          
            // USER
            {
              title: 'user',
              path: '/user',
              icon: ICONS.user,
            },
          ],
        },
      
      ];
    } 
  } // END IF

  // USER
  return [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'general',
      items: [
        { title: 'dashboard', path: '/dashboard', icon: ICONS.dashboard },
      ],
    },
  ];

}

export default navConfig;
