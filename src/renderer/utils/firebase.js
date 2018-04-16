import { create } from '@most/create'

export function observeFirebase(eventName, firebaseReference) {
  return create((add, end, error) => {
    firebaseReference.on(eventName, add)
    return () => firebaseReference.off(eventName, add)
  })
}

export function observeFirebaseValue(eventName, firebaseReference, augmentation = (v) => v) {
  return create((add, end, error) => {
    firebaseReference.on(eventName, (snap) => add(augmentation(snap.val())))
    return () => firebaseReference.off(eventName, add)
  })
}