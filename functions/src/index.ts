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