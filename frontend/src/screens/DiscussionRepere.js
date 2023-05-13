import Discussion from '../components/Discussion';
/**
 * Affichage de la discussion du repère des loups-garous
 * 
 * @param {int} idSession 
 * @returns 
 */
export default function DiscussionRepere({ idSession }) {
    return (
        <Discussion title={'Repère des loups-garous'} idDiscussion={'repere'} idSession={idSession} />
    );
}