import {
  MESSAGES_LOADING,
  MESSAGES_LOADED,
  ADD_MESSAGE,
  ADD_CHAT,
  CHANGE_CHAT,
  CHATS_LOADING,
  CHATS_LOADED,
  SET_CHAT_ONLINE,
  UPDATE_CHAT,
  FOCUS_MESSAGE,
  DELETE_MESSAGE,
} from '../actions/types';

const initialState = {
  messages: [],
  currentChat: 0,
  chats: [],
  focused: [],
  isLoading: false,
  chatsLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case MESSAGES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case CHATS_LOADING:
      return {
        ...state,
        chatsLoading: true,
      };
    case MESSAGES_LOADED:
      return {
        ...state,
        messages: action.payload,
        isLoading: false,
      };
    case CHATS_LOADED:
      return {
        ...state,
        chats:
          action.payload.length !== 0
            ? action.payload
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.lastMessageDate) - new Date(a.lastMessageDate),
                )
            : action.payload,
        chatsLoading: false,
      };
    case FOCUS_MESSAGE:
      let exists = false;
      let focusedTemp = state.focused.filter((elem) => {
        if (elem !== action.payload) return true;
        else {
          exists = true;
          return false;
        }
      });
      if (!exists) focusedTemp = [...focusedTemp, action.payload];

      return {
        ...state,
        focused: focusedTemp,
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(
          (elem) => !action.payload.includes(elem._id),
        ),
        focused: [],
      };
    case CHANGE_CHAT:
      return {
        ...state,
        currentChat: action.payload,
      };
    case UPDATE_CHAT:
      return {
        ...state,
        chats: state.chats
          .map((elem) => {
            if (elem._id === action.payload._id) {
              return action.payload;
            } else return elem;
          })
          .slice()
          .sort(
            (a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate),
          ),
      };
    case SET_CHAT_ONLINE:
      return {
        ...state,
        chats: state.chats.map((elem) => {
          if (elem.talker._id === action.payload._id) {
            elem.talker = action.payload;
            return elem;
          } else if (elem.sender._id === action.payload._id) {
            elem.sender = action.payload;
            return elem;
          } else return elem;
        }),
      };
    case ADD_CHAT:
      return {
        ...state,
        chats: [...state.chats, action.payload]
          .slice()
          .sort(
            (a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate),
          ),
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    default:
      return state;
  }
}
