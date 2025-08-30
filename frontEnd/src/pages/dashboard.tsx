import { IonPage } from "@ionic/react";
import { useAuthGuard } from "../contexts/authGaurd";

export default function Dashboard(){
    useAuthGuard();
    return <IonPage>
        <h1>Dashboard Page</h1>
    </IonPage>
}