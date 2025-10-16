/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// This recieves 2-args ; action-type and async-function that will return payload for reducer. AVOID calling "getAddress" as they are convention for useSelector functions.
// createAsyncThunk will produce 3 additional action-types i.e. pending, fulfilled, rejected states. So need to handle them separately in "reducers".
export const fetchAddress = createAsyncThunk("user/fetchAddress", async function () {
  // 1) We get the user's geolocation position
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  // 3) Then we return an object with the data that we are interested in
  return { position, address };
});

const initialState = {
  username: "",
  status: "idle",
  position: {},
  address: "",
  error: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    }
  },
  // Chain all the extra reducers cases together.
  extraReducers: (builder) => builder.addCase(fetchAddress.pending,
    (state, action) => { state.status = "loading" })
    .addCase(fetchAddress.fulfilled,
      (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
    .addCase(fetchAddress.rejected,
      (state, action) => {
        state.status = "error";
        state.error = action.error.message + " There was a problem getting your address. Make sure to fill this field!";
      })
});

export const { updateName } = userSlice.actions; // Access to the "action-creators".
export default userSlice.reducer;