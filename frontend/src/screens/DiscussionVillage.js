import Discussion from '../components/Discussion';

export default function DiscussionVillage({ idSession }) {
    return(
        <Discussion title={'Place du village'} idDiscussion={'place'} idSession={idSession} />
    );
}