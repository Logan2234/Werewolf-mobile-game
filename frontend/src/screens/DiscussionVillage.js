import Discussion from '../components/Discussion';

/**
 * Affichage de la discussion de la place du village
 * 
 * @param {int} idSession 
 * @returns 
 */
export default function DiscussionVillage({ idSession }) {
    return(
        <Discussion title={'Place du village'} idDiscussion={'place'} idSession={idSession} />
    );
}