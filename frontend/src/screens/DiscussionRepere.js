import Discussion from "../components/Discussion";
import { commonStyles } from "../constants/style";
import { vues } from "../constants/screens";


export default function DiscussionRepere({ token, idGame }) {

    return(
        <Discussion token={token} idDiscussion={'repere'} idGame={idGame}/>
    )
}