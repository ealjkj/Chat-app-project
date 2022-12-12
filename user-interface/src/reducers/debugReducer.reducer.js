export default function debugReducer(state = null, action) {
  switch (action.type) {
    default:
      console.log(action.type);
      return state;
  }
}
