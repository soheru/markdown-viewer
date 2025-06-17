import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PreviewHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
`;

const MarkdownContainer = styled.div`
  flex: 1;
  min-height: 500px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.surface};
  
  /* Custom Markdown Styling */
  h1, h2, h3, h4, h5, h6 {
    margin-top: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text};
  }
  
  h1 {
    font-size: 2rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  h2 {
    font-size: 1.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.lg};
  }
  
  blockquote {
    margin: ${({ theme }) => theme.spacing.md} 0;
    padding-left: ${({ theme }) => theme.spacing.md};
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textLight};
  }
  
  code {
    font-family: 'Courier New', monospace;
    background-color: #f5f5f5;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 0.9rem;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    code {
      padding: 0;
      background-color: transparent;
      border-radius: 0;
    }
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    th, td {
      border: 1px solid ${({ theme }) => theme.colors.border};
      padding: ${({ theme }) => theme.spacing.sm};
      text-align: left;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    
    tr:nth-child(even) {
      background-color: #fafafa;
    }
  }
  
  hr {
    border: 0;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
    margin: ${({ theme }) => theme.spacing.md} 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin: ${({ theme }) => theme.spacing.md} 0;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

const MarkdownPreview = ({ content }) => {
  return (
    <PreviewContainer>
      <PreviewHeader>Preview</PreviewHeader>
      <MarkdownContainer>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]} // Support GitHub Flavored Markdown (tables, etc.)
          rehypePlugins={[rehypeRaw, rehypeSanitize]} // Allow HTML but sanitize it
        >
          {content}
        </ReactMarkdown>
      </MarkdownContainer>
    </PreviewContainer>
  );
};

export default MarkdownPreview;