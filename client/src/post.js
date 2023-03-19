/* eslint-disable jsx-a11y/anchor-is-valid */
import {formatISO9075} from "date-fns";

export default function Post({title,summary,cover,content,createdAt}){
    return(
        <div className="post">
        <div className="image">
          <img
            src="https://techcrunch.com/wp-content/uploads/2023/02/MWC-6G-session.jpg?w=430&h=230&crop=1"
            alt=""
          />
        </div>
        <div className="text">
          <h2>{title}</h2>
          <p className="info">
            
            <a className="author">Jayant</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    )
}