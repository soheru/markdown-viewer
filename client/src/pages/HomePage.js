import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api/api';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownPreview from '../components/MarkdownPreview';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FileInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button`
  background-color: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.secondary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const ShareLinkContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: ${props => props.visible ? 'block' : 'none'};
`;

const ShareLink = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const LinkInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 1rem;
`;

const StatusMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${props =>
    props.type === 'success' ? '#e8f5e9' :
      props.type === 'error' ? '#ffebee' : '#e3f2fd'};
  color: ${props =>
    props.type === 'success' ? props.theme.colors.success :
      props.type === 'error' ? props.theme.colors.error : props.theme.colors.info};
  border-left: 4px solid ${props =>
    props.type === 'success' ? props.theme.colors.success :
      props.type === 'error' ? props.theme.colors.error : props.theme.colors.info};
  display: ${props => props.visible ? 'block' : 'none'};
`;

const HomePage = () => {
  const navigate = useNavigate();
  const [markdownContent, setMarkdownContent] = useState('# Hello Markdown\n\nWrite your content here or upload a file.\n\n## Tables Example\n\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Row 1    | Data     | Data     |\n| Row 2    | Data     | Data     |\n\n## Lists Example\n\n- Item 1\n- Item 2\n  - Nested Item');
  const [title, setTitle] = useState('Untitled Document');
  const [isUploading, setIsUploading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set title to the filename without extension
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    setTitle(fileName);

    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdownContent(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleSaveMarkdown = async () => {
    if (!markdownContent.trim()) {
      setStatusMessage({ text: 'Please enter some content', type: 'error' });
      return;
    }

    setIsUploading(true);
    setStatusMessage({ text: 'Saving document...', type: 'info' });

    try {
      // Use the api instance instead of axios directly
      const response = await api.post('/markdown', {
        content: markdownContent,
        title
      });

      if (!response.data || !response.data.shortId) {
        throw new Error('Invalid response from server');
      }

      setShareLink(response.data.url);
      setStatusMessage({ text: 'Document saved successfully!', type: 'success' });
    } catch (error) {
      console.error('Error saving document:', error);
      let errorMessage = 'Failed to save document. Please try again.';

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Server did not respond. Please check your connection.';
      }

      setStatusMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setStatusMessage({ text: 'Link copied to clipboard!', type: 'success' });
  };

  const handleViewDocument = () => {
    if (!shareLink) return;

    try {
      const shortId = shareLink.split('/').pop();
      console.log('Navigating to document with shortId:', shortId);
      navigate(`/view/${shortId}`);
    } catch (error) {
      console.error('Error parsing share link:', error);
      setStatusMessage({ text: 'Invalid document link', type: 'error' });
    }
  };

  return (
    <HomeContainer>
      <Title>Create & Share Markdown Documents</Title>

      <StatusMessage visible={statusMessage.text} type={statusMessage.type}>
        {statusMessage.text}
      </StatusMessage>

      <UploadContainer>
        <label htmlFor="title">Document Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
        />

        <FileInput>
          <label htmlFor="file-upload">Or upload a markdown file:</label>
          <input
            id="file-upload"
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleFileUpload}
          />
        </FileInput>
      </UploadContainer>

      <ButtonGroup>
        <Button
          primary
          onClick={handleSaveMarkdown}
          disabled={isUploading || !markdownContent.trim()}
        >
          {isUploading ? 'Saving...' : 'Save & Generate Link'}
        </Button>
      </ButtonGroup>

      <TwoColumnLayout>
        <MarkdownEditor content={markdownContent} setContent={setMarkdownContent} />
        <MarkdownPreview content={markdownContent} />
      </TwoColumnLayout>      <ShareLinkContainer visible={shareLink}>
        <h2>Document Saved!</h2>
        <p>Share this link with others to view your markdown document on <strong>kickshare.fun</strong>:</p>

        <ShareLink>
          <LinkInput value={shareLink} readOnly />
          <Button onClick={handleCopyLink}>Copy</Button>
          <Button primary onClick={handleViewDocument}>View</Button>
        </ShareLink>

        <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
          Powered by <a href="https://kickshare.fun" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>kickshare.fun</a> -
          Create, share, and view markdown documents easily.
        </div>
      </ShareLinkContainer>
    </HomeContainer>
  );
};

export default HomePage;