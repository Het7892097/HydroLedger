import { IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import {
  triangle,
  ellipse,
  square,
  settingsOutline,
  home,
  timeOutline,
  checkboxOutline,
} from "ionicons/icons";
import { Settings } from "lucide";

const BottomTabs: React.FC = () => {
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="tab1" href="/login">
        <IonIcon aria-hidden="true" icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="tab2" href="/setting">
        <IonIcon aria-hidden="true" icon={timeOutline} />
        <IonLabel>History</IonLabel>
      </IonTabButton>

      <IonTabButton tab="tab3" href="/listing">
        <IonIcon aria-hidden="true" icon={checkboxOutline} />
        <IonLabel>Listing</IonLabel>
      </IonTabButton>

      <IonTabButton tab="settings" href="/settings">
        <IonIcon aria-hidden="true" icon={settingsOutline} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default BottomTabs;
