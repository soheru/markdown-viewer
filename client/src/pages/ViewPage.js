import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api/api';
import MarkdownPreview from '../components/MarkdownPreview';

const ViewContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const DocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DocumentTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DocumentMeta = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
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
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  
  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary} transparent ${({ theme }) => theme.colors.primary} transparent;
    animation: spin 1.2s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: #ffebee;
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const ViewPage = () => {
  const { shortId } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      console.log('Fetching document with shortId:', shortId);
      try {
        const response = await api.get(`/markdown/${shortId}`);
        console.log('Document fetch response:', response.data);
        setDocument(response.data);
      } catch (err) {
        console.error('Error fetching document:', err);
        let errorMessage = 'Document not found or has been removed.';

        if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.request) {
          errorMessage = 'Server did not respond. Please check your connection.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [shortId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <ViewContainer>
        <LoadingSpinner />
      </ViewContainer>
    );
  }

  if (error) {
    return (
      <ViewContainer>
        <ErrorMessage>
          <h2>Error</h2>
          <p>{error}</p>
        </ErrorMessage>
        <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
      </ViewContainer>
    );
  }

  return (
    <ViewContainer>
      <DocumentHeader>
        <div>
          <DocumentTitle>{document.title}</DocumentTitle>
          <DocumentMeta>
            Document ID: <strong>{shortId}</strong> • Created: {formatDate(document.createdAt)}
          </DocumentMeta>
        </div>
      </DocumentHeader>

      <ButtonGroup>
        <Button onClick={handleCopyLink}>Copy Shareable Link</Button>
        <Button onClick={() => window.location.href = '/'}>Create New Document</Button>
      </ButtonGroup>

      <MarkdownPreview content={document.content} />
    </ViewContainer>
  );
};

export default ViewPage;