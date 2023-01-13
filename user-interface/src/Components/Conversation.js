import { gql, useSubscription } from "@apollo/client";
import { Grid, Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import MessagesSection from "./MessagesSection";
import SearchBar from "./SearchBar";
import CreateConversationModal from "./CreateConversationModal";
import DetailsModal from "./DetailsModal";
import NullConversation from "./NullConversation";
import { addMessage } from "../slices/messages.slice";
import { closeModal } from "../slices/modalOpen.slice";
import { closeDetailsModal } from "../slices/detailsModalOpen.slice";
import { changeSearch } from "../slices/searcher.slice";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const MESSAGES_SUBSCRIPTION = gql`
  subscription messageCreated($conversationId: ID!) {
    messageCreated(conversationId: $conversationId) {
      _id
      from
      text
      conversationId
      authorName
      createdAt
    }
  }
`;

const Conversation = () => {
  const { conversationId } = useParams();
  const { t } = useTranslation();
  const conversation = useSelector((state) => {
    return state.conversations.find(
      (conversation) => conversation._id === conversationId
    );
  });

  const dispatch = useDispatch();
  const modalOpen = useSelector((state) => state.modalOpen);
  const detailsModalOpen = useSelector((state) => state.detailsModalOpen);

  useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { conversationId },
    onData: (args) => {
      const data = args.data.data;
      const message = {
        ...data.messageCreated,
        content: data.messageCreated.text,
      };
      dispatch(addMessage({ message }));
    },
  });

  useEffect(() => {
    dispatch(changeSearch({ value: "" }));
  }, []);

  const handleCloseModal = () => dispatch(closeModal());
  const handleCloseDetailsModal = () => dispatch(closeDetailsModal());

  const handleChange = (event) => {
    dispatch(changeSearch({ value: event.target.value }));
  };

  return (
    <Grid container>
      <Grid
        item
        md={3}
        sx={{
          height: "calc( 100vh - 64px)",
        }}
      >
        <SearchBar
          height={100}
          menu={true}
          label={t("searchConversations")}
          onChange={handleChange}
        />
        <Box
          sx={{
            height: "calc( 100vh - 64px - 100px)",
            overflowY: "scroll",
          }}
        >
          <ConversationsList />
        </Box>
      </Grid>

      <Grid item md={9}>
        {conversation ? <MessagesSection /> : <NullConversation />}
      </Grid>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div>
          <CreateConversationModal />
        </div>
      </Modal>

      <Modal open={detailsModalOpen} onClose={handleCloseDetailsModal}>
        <div>
          <DetailsModal />
        </div>
      </Modal>
    </Grid>
  );
};

export default Conversation;
