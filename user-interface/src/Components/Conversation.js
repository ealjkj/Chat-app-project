import { Grid, Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import MessagesSection from "./MessagesSection";
import SearchBar from "./SearchBar";
import CreateConversationModal from "./CreateConversationModal";
import DetailsModal from "./DetailsModal";
import NullConversation from "./NullConversation";
import { closeModal } from "../slices/modalOpen.slice";
import { closeDetailsModal } from "../slices/detailsModalOpen.slice";
import { changeSearch } from "../slices/searcher.slice";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { reset } from "../slices/participantsToAdd.slice";
import { Link as RouterLinK, Navigate } from "react-router-dom";


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

  useEffect(() => {
    dispatch(changeSearch({ value: "" }));
  }, []);

  const handleCloseModal = () => {
    dispatch(closeModal());
    dispatch(reset());
  };
  const handleCloseDetailsModal = () => dispatch(closeDetailsModal());

  const handleChange = (event) => {
    dispatch(changeSearch({ value: event.target.value }));
  };

  if(!conversation && conversationId !== "home") {
    return <Navigate to="/user/conversation/home" replace={true}/>
  }  

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sm={3}
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

      <Grid item sm={9} xs={12}>
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
