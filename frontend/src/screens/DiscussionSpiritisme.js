import Discussion from "../components/Discussion";
import { commonStyles } from "../constants/style";
import { vues } from "../constants/screens";


export default function DiscussionSpiritisme({ token, idGame }) {

    return(
        <Discussion token={token} idDiscussion={'place'} idGame={idGame}/>
    )
}