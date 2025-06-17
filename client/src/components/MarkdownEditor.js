import React from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EditorHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
`;

const EditorTextArea = styled.textarea`
  flex: 1;
  min-height: 500px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  resize: vertical;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const MarkdownEditor = ({ content, setContent }) => {
  return (
    <EditorContainer>
      <EditorHeader>Editor</EditorHeader>
      <EditorTextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write or paste your markdown here..."
      />
    </EditorContainer>
  );
};

export default MarkdownEditor;