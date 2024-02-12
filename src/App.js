import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { FaClock, FaEye, FaVuejs } from 'react-icons/fa';

function Header(props) {
  return (
    <header>
      <h1>
        <a href="/" onClick={(event) => {
          event.preventDefault();
          props.onChangeMode();
        }}>{props.title}</a>
      </h1>
    </header>
  );
}

function Listbar() {
  return (
    <listbar>
      <h5 id="ID">No</h5>
      <h5 id="title">제목</h5>
      <h5 id="creator">작성자</h5>
    </listbar>
  );
}

function Nav(props) {
  const [navv, setnavv] = useState(null);

  const TopicClick = (event, topicId) => {
    event.preventDefault();
    if (navv === topicId) {
      setnavv(null);
    } else {
      setnavv(topicId);
      props.onView(topicId);
    }
    props.onChangeMode(Number(topicId));
  };

  return (
    <nav>
      <ol>
        {props.topics.map((topic) => (
          <li key={topic.id}>
            <div id="list">
              <div id="idList">
                <span>{topic.id}</span>
              </div>
              <div id="listTitle">
                <a id={topic.id} href={"/read/" + topic.id} onClick={(event) => 
                TopicClick(event, topic.id)}>{topic.title}</a>
              </div>
              <div id="listCreator">
                <span>{topic.author}</span>
              </div>
              <div
                id="underbutton"
                style={{
                  transform: navv === topic.id ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",}}>
                <span id={topic.id} href={"/read/" + topic.id} onClick={(event) => 
                TopicClick(event, topic.id)}><FaVuejs />
                </span>
              </div>
            </div>
            {navv === topic.id && (
              <Article
                title={topic.title}
                body={topic.body}
                timestamp={topic.timestamp}
                viewCount={props.viewCounts[topic.id] || 0}
                onUpdate={() => {
                  props.onUpdate(topic.id);
                }}
                onDelete={() => {
                  props.onDelete(topic.id);
                }}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Article(props) {
  const [typingText, setTypingText] = useState('');

  const handleUpdateClick = () => {
    props.onUpdate();
  };

  const handleDeleteClick = () => {
    props.onDelete();
  };

  useEffect(() => {
    setTypingText('');
    let timer;
    let currentIndex = 0;

    const typingEffect = () => {
      if (currentIndex <= props.body.length) {
        setTypingText((prevText) => prevText + props.body.charAt(currentIndex));
        currentIndex++;
        timer = setTimeout(typingEffect, 100);
      }
    };

    typingEffect();
    return () => {
      clearTimeout(timer);
    };
  }, [props.body]);

  return (
    <article id="body">
      <section>
        <div id="articletitle">내용</div>
        <div id="importent">
          <div id="timestamp"><FaClock /> {props.timestamp}</div>
          <div id="viewcount"><FaEye /> {props.viewCount}</div>
        </div>
      </section>
      <div id="bodytext">{typingText}</div>
      <div id="bodybtn">
        <p><input type="submit" value="수정" onClick={handleUpdateClick} /></p>
        <p><input type="submit" value="삭제" onClick={handleDeleteClick} /></p>
      </div>
    </article>
  );
}

function Create(props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const handleCreateClick = () => {
    props.onCreate(title, body, author, getCurrentDate());
    setTitle("");
    setBody("");
    setAuthor("");
  };

  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        handleCreateClick();
      }}>
        <div>
          <p><input type="text" name="title" placeholder="  title" value={title} onChange={(event) =>
            setTitle(event.target.value)} required /></p>
          <p>
            <input type="text" name="author" placeholder="  작성자" value={author} onChange={(event) =>
              setAuthor(event.target.value)} required />
          </p>
        </div>
        <p>
          <textarea name="body" placeholder="  한칸 띄고 작성해주세요" value={body} onChange={(event) =>
            setBody(event.target.value)} required></textarea>
        </p>
        <p className="btn">
          <input type="submit" value="입력"></input>
        </p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  const [author, setAuthor] = useState(props.author);
  const [updateTime, setUpdateTime] = useState(props.timestamp);

  const handleUpdateClick = () => {
    const newUpdateTime = new Date().toLocaleString();
    setUpdateTime(newUpdateTime);
    props.onUpdate(title, body, author, newUpdateTime);
  };

  useEffect(() => {
    setTitle(props.title);
    setBody(props.body);
    setAuthor(props.author);
    setUpdateTime(props.timestamp);
  }, [props]);

  return (
    <article>
      <h2>수정</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        handleUpdateClick();
      }}>
        <div>
          <p>
            <input type="text" name="title" value={title} onChange={(event) => {
              setTitle(event.target.value);
            }} required />
          </p>
          <p>
            <input type="text" name="author" value={author} onChange={(event) => {
              setAuthor(event.target.value);
            }} disabled />
          </p>
        </div>
        <p>
          <textarea name="body" value={body} onChange={(event) => {
            setBody(event.target.value);
          }} required></textarea>
        </p>
        <p className="btn">
          <input type="submit" value="저장"></input>
        </p>
      </form>
    </article>
  );
}

function App() {
  const [mode, Setmode] = useState("WELCOME");
  const [id, Setid] = useState(null);
  const [nextId, setnextId] = useState(1);
  const [topics, Settopcis] = useState([]);
  const [viewCounts, setViewCounts] = useState({});

  const itemsPerPage = 5;
  const totalPages = Math.ceil(topics.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTopics = topics.slice(startIndex, endIndex);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (deletedId) => {
    const newTopics = topics.filter((topic) => topic.id !== deletedId);
    Settopcis(newTopics);

    const reordTopics = newTopics.map((topic, index) => ({
      ...topic,
      id: index + 1,
    }));
    Settopcis(reordTopics);
    setnextId(reordTopics.length + 1);
    Setmode("WELCOME");
  };

  let content = null;
  let contextcontrol = null;

  if (mode === "READ") {
    let _title, _body, _author, _timestamp = "";
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        _title = topics[i].title;
        _body = topics[i].body;
        _author = topics[i].author;
        _timestamp = topics[i].timestamp;
        break;
      }
    }

    contextcontrol = (
      <>
        <a href={"/update/" + id} onClick={(event) => {
            event.preventDefault();
            Setmode("UPDATE");
          }}></a>
        <input type="button" value="" onClick={() => 
        handleDelete(id)} style={{ display: "none" }}/>
      </>
    );
  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(_title, _body, _author, _timestamp) => {
          const newTopic = {
            id: nextId,
            title: _title,
            body: _body,
            author: _author,
            timestamp: _timestamp,
          };
          const newTopics = [...topics, newTopic];
          Settopcis(newTopics);
          Setmode("READ");
          Setid(nextId);
          setnextId(nextId + 1);
        }}
      />
    );
  } else if (mode === "UPDATE") {
    const topicToUpdate = topics.find((topic) => topic.id === id);
    if (topicToUpdate) {
      content = (
        <Update
          title={topicToUpdate.title}
          body={topicToUpdate.body}
          author={topicToUpdate.author}
          timestamp={topicToUpdate.timestamp}
          onUpdate={(_title, _body, _author, _timestamp) => {
            const updatedTopic = {
              id: id,
              title: _title,
              body: _body,
              author: _author,
              timestamp: _timestamp,
            };
            const updatedTopics = topics.map((topic) =>
              topic.id === id ? updatedTopic : topic
            );
            Settopcis(updatedTopics);
            Setmode("READ");
          }}
        />
      );
    }
  }

  return (
    <div className="App">
      <Header title="CRUD 게시판" onChangeMode={() => { }}></Header>
      <Listbar></Listbar>
      <Nav
        topics={currentTopics}
        onChangeMode={(_id) => {
          Setmode("READ");
          Setid(_id);
        }}
        onUpdate={(topicId) => {
          Setid(topicId);
          Setmode("UPDATE");
        }}
        onDelete={(topicId) => {
          handleDelete(topicId);
        }}
        onView={(topicId) => {
          setViewCounts((prevViewCounts) => ({
            ...prevViewCounts,
            [topicId]: (prevViewCounts[topicId] || 0) + 1,
          }));
        }}
        viewCounts={viewCounts}
      />
      {content}
      {mode !== "CREATE" && (
        <ul id="button">
          <li>
            <a href="/create" onClick={(event) => {
                event.preventDefault();
                Setmode("CREATE");}}>쓰기</a>
          </li>
          {contextcontrol}
        </ul>
      )}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <span
            key={page}
            className={`page-number ${currentPage === page ? "active" : ""}`}
            onClick={() => changePage(page)}>
            {page}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
