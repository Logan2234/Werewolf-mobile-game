import Discussion from '../components/Discussion';

export default function DiscussionRepere({ idSession }) {
    return (
        <Discussion title={'Repère des loups-garous'} idDiscussion={'repere'} idSession={idSession} />
    );
}