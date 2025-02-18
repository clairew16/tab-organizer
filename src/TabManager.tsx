import { useState, useEffect } from 'react';

interface Tab {
  url: string;
  title: string;
  id?: number;
}

const TabManager = () => {
  const [savedTabs, setSavedTabs] = useState<Tab[]>([]);
  const [customTitle, setCustomTitle] = useState(''); // State for custom title input

  useEffect(() => {
    updateTabList();
  }, []);

  // Function to update the tab list
  const updateTabList = () => {
    chrome.storage.local.get(['savedTabs'], (result) => {
      const tabs = result.savedTabs || [];
      setSavedTabs(tabs); // Update state with the fetched tabs
    });
  };

  // Function to save the current tab
  const saveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]; // Get the active tab
      const titleToSave = customTitle || tab.title || 'Untitled';
      chrome.storage.local.get(['savedTabs'], (result) => {
        let savedTabs = result.savedTabs || []; // Get existing saved tabs
        const tabData = {
          url: tab.url,
          title: titleToSave,
          id: tab.id,
        };
        savedTabs.push(tabData); // Add the current tab to the list
        chrome.storage.local.set({ savedTabs: savedTabs }, () => {
          updateTabList(); // Update the tab list after saving
          setCustomTitle('');
        });
      });
    });
  };

  // Function to clear the saved tabs list
  const clearList = () => {
    chrome.storage.local.set({ savedTabs: [] }, () => {
      updateTabList(); // Update the tab list after clearing
    });
  };

  return (
    <div>
      <div>
      <input
        type="text"
        placeholder="Enter a custom title"
        value={customTitle}
        onChange={(e) => setCustomTitle(e.target.value)}
      />
      </div>
      {/* Button to save the current tab */}
      <button onClick={saveTab}>Save Current Tab</button>

      {/* Button to clear the saved tabs list */}
      <button onClick={clearList}>Clear List</button>

      {/* List to display saved tabs */}
      <ul id="tabList">
        {savedTabs.map((tab, index) => (
          <li key={index}>
            <a href={tab.url} target="_blank" rel="noopener noreferrer">
              {tab.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabManager;