import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Auth, SignIn,SocialAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from "@supabase/auth-ui-shared";

import './Tab1.css';
import { supabaseClient } from '../services/db/supabaseClient';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
        {/* <IonButton onClick={SignIn}/> */}
        {/* <SignIn children={<IonButton>Sign in with google</IonButton>} supabaseClient={supabaseClient} dark={false} /> */}
         <Auth
      supabaseClient={supabaseClient}
      providers={['google']} // add other providers as needed
      appearance={{ theme: ThemeSupa }}
      // You can customize available social/email sign-in methods
    />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
