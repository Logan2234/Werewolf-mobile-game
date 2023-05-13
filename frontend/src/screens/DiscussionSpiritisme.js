import Discussion from '../components/Discussion';

/**
 * Affichage de la discussion entre le spiritisme et les morts
 * 
 * @param {int} idSession 
 * @returns 
 */
export default function DiscussionSpiritisme({ idSession }) {
    // TODO : rajouter à quelle personne on parle (le spiritiste ou le mort)
    return (
        <Discussion title={'Salle de spiritisme'} idDiscussion={'spiritism'} idSession={idSession} />
    );
}