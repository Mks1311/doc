"use client"; // Mark this as a Client Component

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styles from './styles/A4Page.module.css';

const DocumentEditor = () => {
  const [pages, setPages] = useState([{ id: 1, content: '' }]);
  const pageRefs = useRef([]);
  const editorRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const currentPageIndex = pages.length - 1;
      const currentPage = pages[currentPageIndex];

      // Update the current page's content
      const updatedPages = [...pages];
      updatedPages[currentPageIndex].content = content;
      setPages(updatedPages);

      // Check if the content overflows the A4 page
      const pageElement = pageRefs.current[currentPageIndex];
      if (pageElement && pageElement.scrollHeight > pageElement.clientHeight) {
        // Move the overflow content to a new page
        const overflowContent = editor.getHTML();
        editor.commands.setContent(''); // Clear the current editor

        // Add a new page with the overflow content
        setPages((prevPages) => [
          ...prevPages,
          { id: prevPages.length + 1, content: overflowContent },
        ]);
      }
    },
  });

  // Focus the editor when the page is clicked
  const handlePageClick = () => {
    if (editor) {
      editor.commands.focus();
    }
  };

  useEffect(() => {
    // Focus the editor on the last page
    if (editor && pages.length > 0) {
      editor.commands.setContent(pages[pages.length - 1].content);
    }
  }, [pages, editor]);

  return (
    <div>
      {pages.map((page, index) => (
        <div
          key={page.id}
          ref={(el) => (pageRefs.current[index] = el)}
          className={styles.a4Page}
          onClick={handlePageClick} // Make the entire page clickable
        >
          <div className={styles.editorContainer}>
            {index === pages.length - 1 ? (
              <EditorContent editor={editor} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentEditor;