import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

interface Room {
  readonly title: string;
  readonly detail: string;
  readonly roomerAddress: string;
  readonly txHash: string;
  readonly roomerName: string;
  readonly roomKey: string;
  readonly genre: string;
  readonly created: string;
  readonly limit: string;
  readonly when: string;
  readonly prize: number;
}

interface RootRoom extends Room {
  roomId?: FirebaseFirestore.DocumentReference;
}

export const onUsersRoomCreate = functions.firestore.document('/users/{userId}/rooms/{roomId}').onCreate(async (snapshot, context) => {
  await copyToRootWithUsersRoomSnapshot(snapshot, context);
});
export const onUsersRoomUpdate = functions.firestore.document('/users/{userId}/rooms/{roomId}').onUpdate(async (change, context) => {
  await copyToRootWithUsersRoomSnapshot(change.after, context);
});

async function copyToRootWithUsersRoomSnapshot(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
  const roomId = snapshot.id;
  const userId = context.params.userId;
  const room = snapshot.data() as RootRoom;
  room.roomId = firestore.collection('users').doc(userId);
  await firestore.collection('rooms').doc(roomId).set(room, { merge: true });
}



interface Proposal {
  readonly contributorAddress: string;
  readonly propose: string;
  readonly proposeKey: string;
  readonly roomKey: string;
  readonly roomerAddress: string;
  readonly txHash: string;
}

interface  UserProposal extends Proposal {
  proposalId?: FirebaseFirestore.DocumentReference;
}

export const onUsersRoomProposalCreate = functions.firestore.document('/users/{userId}/rooms/{roomId}/proposals/{proposalId}').onCreate(async (snapshot, context) => {
  await copyToUsersWithUsersRoomsProposalSnapshot(snapshot, context);
});
export const onUsersRoomProposalUpdate = functions.firestore.document('/users/{userId}/rooms/{roomId}/proposals/{proposalId}').onUpdate(async (change, context) => {
  await copyToUsersWithUsersRoomsProposalSnapshot(change.after, context);
});

async function copyToUsersWithUsersRoomsProposalSnapshot(snapshot: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
  const proposalId = snapshot.id;
  const userId = context.params.userId;
  const roomId = context.params.roomId;
  const proposal = snapshot.data() as UserProposal;
  const proposer = proposal.contributorAddress
  proposal.proposalId = firestore.collection('users').doc(userId).collection('rooms').doc(roomId);
  await firestore.collection('users').doc(proposer).collection('proposals').doc(proposalId).set(proposal, { merge: true });
}