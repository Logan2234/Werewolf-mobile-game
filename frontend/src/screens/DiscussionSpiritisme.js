import Discussion from '../components/Discussion';

export default function DiscussionSpiritisme({ idSession }) {
    // TODO : rajouter à quelle personne on parle (le spiritiste ou le mort)
    return (
        <Discussion title={'Salle de spiritisme'} idDiscussion={'place'} idSession={idSession} />
    );
}