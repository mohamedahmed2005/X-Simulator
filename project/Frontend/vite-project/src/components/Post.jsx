import PostCreation from './PostCreation';
import PostItem from './PostItem';
import ConfirmationModal from './ConfirmationModal';
import MessageDisplay from './MessageDisplay';
import { 
  usePosts, 
  useConfirmationModal, 
  useMessage 
} from '../hooks';
import { formatDate } from '../utils/dateUtils';

const Post = ({ user, onPostCreated, onPostDeleted, onFollowUpdate }) => {
  const {
    posts,
    loading,
    fetchPosts,
    addPost,
    updatePost,
    removePost,
    updatePostLikes,
    addComment,
    updateComment,
    removeComment
  } = usePosts();

  const {
    showConfirmModal,
    confirmAction,
    showDeletePostModal,
    showDeleteCommentModal,
    hideModal
  } = useConfirmationModal();

  const { message, showMessage, hideMessage } = useMessage();

  const handleConfirmDelete = async () => {
    if (confirmAction.type === 'delete') {
      const result = await removePost(confirmAction.postId);
      if (result && result.success) {
        showMessage('Post deleted successfully!', 'success');
      } else if (result) {
        showMessage(result.message, 'error');
      }
    } else if (confirmAction.type === 'delete-comment') {
      const result = await removeComment(confirmAction.postId, confirmAction.commentId);
      if (result && result.success) {
        showMessage('Comment deleted successfully!', 'success');
      } else if (result) {
        showMessage(result.message, 'error');
      }
    }
    hideModal();
  };

  const handleConfirmEdit = () => {
    // Edit is handled directly in PostItem component
    hideModal();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white text-base font-normal">Loading posts...</div>;
  }

  return (
    <div className="max-w-full">
      {/* Message Display */}
      <MessageDisplay message={message} onClose={hideMessage} />

      {/* Create Post Section */}
      <PostCreation 
        user={user}
        onPostCreated={onPostCreated}
        fetchPosts={fetchPosts}
        showMessage={showMessage}
      />

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-x-text-gray">No posts yet. Be the first to post something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              user={user}
              onFollowUpdate={onFollowUpdate}
              onPostDeleted={onPostDeleted}
              updatePostLikes={updatePostLikes}
              removePost={removePost}
              addComment={addComment}
              updateComment={updateComment}
              removeComment={removeComment}
              showDeletePostModal={showDeletePostModal}
              showDeleteCommentModal={showDeleteCommentModal}
              showMessage={showMessage}
              formatDate={formatDate}
            />
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        showConfirmModal={showConfirmModal}
        confirmAction={confirmAction}
        onConfirm={confirmAction.type === 'edit' ? handleConfirmEdit : handleConfirmDelete}
        onCancel={hideModal}
      />
    </div>
  );
};

export default Post;