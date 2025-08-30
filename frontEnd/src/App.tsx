import { Redirect, Route, useHistory } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import SettingsPage from "./pages/settings";
import ListingPage from "./pages/listing";
import LoginPage from "./pages/login";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
const useEnv = import.meta.env;
import { SocialLogin } from "@capgo/capacitor-social-login";
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";
/* Theme variables */
import "./theme/variables.css";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "./contexts/userContext";
import { storedUser } from "./types/User";
import { storageService } from "./utils/storage";
import isJWTExpired from "./utils/token-expiry-checker";
import BottomTabs from "./components/Tabs/BottomTabs";
import Dashboard from "./pages/dashboard";
import { sessionProvider } from "./utils/supabase-utils";
import { useAuthGuard } from "./contexts/authGaurd";

setupIonicReact();

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { setUser, userData } = useUserContext();
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const nav = useRef<HTMLIonNavElement>(null);
  const router=useHistory();
  useAuthGuard();
  
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/list">
              <ListingPage />
            </Route>
             <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/setting">
              <SettingsPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/settings">
              <SettingsPage />
            </Route>
            <Route exact path="/listing">
              <ListingPage />
            </Route>
          </IonRouterOutlet>
          <BottomTabs />
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
