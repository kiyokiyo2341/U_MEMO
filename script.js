document.addEventListener('DOMContentLoaded', () => {
    const memoInput = document.getElementById('memoInput');
    const addButton = document.getElementById('addButton');
    const memoList = document.getElementById('memoList');
    const memoCountElement = document.getElementById('memoCount');
    const searchInput = document.getElementById('searchInput');
    const undoButton = document.getElementById('undoButton'); // アンドゥボタンを取得
    let memos = [];
    let editingId = null;
    let searchText = '';
    let deletedMemo = null; // 削除したメモを一時保存

    const updateMemoCount = () => {
        const completedCount = memos.filter(memo => memo.completed).length;
        const totalCount = memos.length;
        letpercentage = 0;
        if (totalCount > 0) {
            percentage = Math.round((completedCount / totalCount) * 100);
        }
        memoCountElement.style.color = percentage === 100 ? 'green' : 'black'; // 完了率が100%のときは緑色に
        memoCountElement.style.fontSize = '1.2em'; // フォントサイズを大きくする
        memoCountElement.style.fontWeight = 'bold'; // 太字にする
        memoCountElement.style.textAlign = 'center'; // 中央揃えにする
        memoCountElement.style.marginBottom = '10px'; // 下にスペースを空ける
        memoCountElement.style.padding = '5px'; // パディングを追加
        memoCountElement.style.border = '1px solid #ccc'; // 枠線を追加
        memoCountElement.style.borderRadius = '5px'; // 角を丸くする
        memoCountElement.style.backgroundColor = '#f9f9f9'; // 背景色を追加
        memoCountElement.style.boxShadow = '0 2px 5px rgba(225, 217, 217, 0.1)'; // シャドウを追加
        memoCountElement.style.transition = 'all 0.3s ease'; // アニメーションを追加
        memoCountElement.style.width = '100%'; // 幅を100%にする
        memoCountElement.style.maxWidth = '600px'; // 最大幅を設定
        memoCountElement.style.margin = '0 auto'; // 中央揃えにする
        memoCountElement.style.borderRadius = '5px'; // 角を丸くする
 

        memoCountElement.textContent = `完了件数: ${completedCount}件 / 全件数: ${memos.length}件`;
        undoButton.disabled = !deletedMemo; // 削除したメモがない場合はアンドゥボタンを無効化
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    const addMemo = () => {
        const newMemoText = memoInput.value.trim();
        if (newMemoText !== '') {
            const now = new Date();
            const newMemo = {
                id: Date.now(),
                text: newMemoText,
                completed: false,
                color: '',
                createdAt: now // 追加した時間を記録
                
            };
            memos.push(newMemo);
            renderMemos();
            updateMemoCount();
            memoInput.value = '';
        }
    };

    const deleteMemo = (id) => {
        const memoToDelete = memos.find(memo => memo.id === id);
        if (memoToDelete) {
            deletedMemo = memoToDelete; // 削除したメモを保存
            memos = memos.filter(memo => memo.id !== id);
            renderMemos();
            updateMemoCount();
        }
    };

    const undoDelete = () => {
        if (deletedMemo) {
            memos.push(deletedMemo); // 保存しておいたメモをリストに戻す
            deletedMemo = null; // 保存したメモをクリア
            renderMemos();
            updateMemoCount();
        }
    };

    const toggleComplete = (id) => {
        memos = memos.map(memo =>
            memo.id === id ? { ...memo, completed: !memo.completed } : memo
        );
        renderMemos();
        updateMemoCount();
    };

    const changeColor = (id, color) => {
        memos = memos.map(memo =>
            memo.id === id ? { ...memo, color: color } : memo
        );
        renderMemos();
    };

    const startEdit = (id) => {
        editingId = id;
        renderMemos();
    };

    const saveEdit = (id, newText) => {
        const now = new Date(); // 保存時の現在時刻を取得
        memos = memos.map(memo =>
            memo.id === id ? { ...memo, text: newText, updatedAt: now } : memo // 更新時間を記録
        );
        editingId = null;
        renderMemos();
        saveMemos(); // ローカルストレージに保存 (まだ実装していない場合は追加)
    };
    

    const cancelEdit = () => {
        editingId = null;
        renderMemos();
    };

    const renderMemos = () => {
        memoList.innerHTML = '';
        const filteredMemos = memos.filter(memo =>
            memo.text.toLowerCase().includes(searchText.toLowerCase())
        );
    
        filteredMemos.forEach(memo => {
            const listItem = document.createElement('li');
            listItem.style.backgroundColor = memo.color;
            listItem.style.display = 'flex';
            listItem.style.justifyContent = 'space-between';
            listItem.style.alignItems = 'center';
            listItem.style.flexDirection = 'column'; // 必要に応じて
    
            const memoContent = document.createElement('div');
            memoContent.style.flexGrow = '1';
            memoContent.classList.add('memo-content'); // クラスを付与
            memoContent.style.width = '100%';
            memoContent.style.marginBottom = '5px';
            memoContent.style.border = '1px double #ccc';
    
            const memoTextarea = document.createElement('textarea');
            memoTextarea.classList.add('memo-textarea-display');
            memoTextarea.value = memo.text;
            memoTextarea.readOnly = editingId !== memo.id;
            memoTextarea.style.width = '100%';
            memoTextarea.style.boxSizing = 'border-box';
            memoTextarea.style.height = 'calc(1.2em * 5 + 2px)';
            memoTextarea.style.resize = 'vertical';

            if (memo.completed) {
                memoTextarea.classList.add('completed');
            }

            memoTextarea.addEventListener('dblclick', () => {
                if (editingId === null) {
                    startEdit(memo.id);
                }
            });

            const createdAtSpan = document.createElement('span');
            createdAtSpan.classList.add('created-at');
            createdAtSpan.textContent = `作成: ${formatDate(memo.createdAt)}`;
            createdAtSpan.style.fontSize = '0.8em';
            createdAtSpan.style.color = '#777';
            createdAtSpan.style.marginLeft = '10px'; // 少し右にスペースを空ける

            memoContent.appendChild(memoTextarea);

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.alignItems = 'center';
            controls.style.marginLeft = 'auto';

            const completeButton = document.createElement('button');
            completeButton.textContent = memo.completed ? '未完了' : '完了';
            completeButton.classList.add('complete-button');
            completeButton.addEventListener('click', () => toggleComplete(memo.id));

            const colorPalette = document.createElement('div');
            ['#a9a9a9', '#98fb98', '#fffacd', '#b0e0e6', '#ffe4e1'].forEach(color => {
                const colorButton = document.createElement('button');
                colorButton.classList.add('color-button');
                colorButton.style.backgroundColor = color;
                colorButton.addEventListener('click', () => changeColor(memo.id, color));
                colorPalette.appendChild(colorButton);
            });

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '削除';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteMemo(memo.id)); 

            if (editingId === memo.id) {
                memoTextarea.classList.add('memo-input-edit');
                memoTextarea.readOnly = false;

                const editButtonGroup = document.createElement('div');
                editButtonGroup.classList.add('button-group-edit');

                const saveButton = document.createElement('button');
                saveButton.textContent = '保存';
                saveButton.classList.add('save-button');
                saveButton.addEventListener('click', () => saveEdit(memo.id, memoTextarea.value));

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'キャンセル';
                cancelButton.classList.add('cancel-button');
                cancelButton.addEventListener('click', cancelEdit);

                controls.appendChild(deleteButton);
                controls.appendChild(cancelButton);
                controls.appendChild(saveButton);

            } else {
                controls.appendChild(deleteButton);

                controls.appendChild(colorPalette);
                controls.appendChild(completeButton);

            }

            listItem.appendChild(memoContent);
            listItem.appendChild(controls); 
            listItem.appendChild(createdAtSpan); // 作成日時をテキストエリアの横に追加

            memoList.appendChild(listItem);
        });
        updateMemoCount();
    };

    addButton.addEventListener('click', addMemo);
    undoButton.addEventListener('click', undoDelete); // アンドゥボタンのイベントリスナー

    memoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            addMemo();
        }
    });

    searchInput.addEventListener('input', (event) => {
        searchText = event.target.value;
        renderMemos();
    });

    renderMemos();
    updateMemoCount();
});