import ReceivedFriendRequest from "./ReceivedFriendRequest";
import AcceptedFriendRequest from "./AcceptedFriendRequest";

export default function Notifications() {
  return (
    <>
      <ReceivedFriendRequest />
      <AcceptedFriendRequest />
    </>
  );
}
