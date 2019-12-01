from flask import Flask, jsonify, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from uuid import uuid4
from urllib.parse import urlparse
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'


CORS(app)
db = SQLAlchemy(app)


class Link(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(80), nullable=False)
    redirectId = db.Column(db.String(80), nullable=False)
    redirectURL = db.Column(db.String(80), nullable=False)
    link = db.Column(db.String(80), nullable=False)
    title = db.Column(db.String(80), nullable=False)
    date = db.Column(db.String(80), nullable=False, default=datetime.utcnow(
    ).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z')

    data = db.relationship('Data', backref=db.backref('link', lazy=True))

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}



class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(80), nullable=False)
    clicks = db.Column(db.Integer, nullable=False)

    link_id = db.Column(db.Integer, db.ForeignKey('link.id'), nullable=True)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}


@app.route('/')
def test_route():
    return jsonify({'working': True})

# Create
@app.route('/api/link', methods=['POST'])
def add_link():
    request_data = request.get_json()

    userId = request_data['userId']
    link = request_data['link']
    title = request_data['title']
    date = request_data['date']
    data = request_data['data']

    base_url = urlparse(request.base_url)

    protocol = base_url.scheme
    host = base_url.netloc
    redirectId = str(uuid4())

    redirectURL = f'{protocol}://{host}/redirect/{redirectId}'

    link = Link(
        userId=userId,
        redirectId=redirectId,
        redirectURL=redirectURL,
        link=link,
        title=title,
        date=date
    )

    db.session.add(link)
    db.session.commit()

    link_data = {
        'id': link.id,
        'userId': link.userId,
        'redirectId': link.redirectId,
        'redirectURL': link.redirectURL,
        'link': link.link,
        'title': link.title,
        'date': link.date,
        'data': []
    }

    return jsonify(link_data)

# Read
@app.route('/api/links/<userId>/', methods=['GET'])
def get_links(userId):
    query = Link.query.filter_by(userId=userId).all()

    links = []

    for l in query:

        link = {}

        link['id'] = l.id
        link['redirectId'] = l.redirectId
        link['redirectURL'] = l.redirectURL
        link['userId'] = l.userId
        link['link'] = l.link
        link['title'] = l.title
        link['date'] = l.date

        data = []

        if l.data:
            for link_data in l.data:
                data_object = {}

                data_object['date'] = link_data.date
                data_object['clicks'] = link_data.clicks

                data.append(data_object)

        link['data'] = data

        links.append(link)

    return jsonify(links)

# Update
@app.route('/api/link/edit/<linkId>', methods=['PUT'])
def update_link(linkId):
    print('updating link!')
    request_data = request.get_json()
    print(request_data)

    title = request_data['title']
    print(title)
    date = request_data['date']
    print(date)

    link_to_edit = Link.query.filter_by(id=linkId).first_or_404()
    link_to_edit.title = title
    link_to_edit.date = date
    db.session.commit()
    print(link_to_edit.as_dict())
    return jsonify(link_to_edit.as_dict())

# Delete
@app.route('/api/link/delete/<linkId>/', methods=['DELETE'])
def delete_link(linkId):
    link_to_delete = Link.query.filter_by(id=linkId).first_or_404()
    db.session.delete(link_to_delete)
    db.session.commit()
    return 'Deleted successfully!'


@app.route('/redirect/<redirectId>', methods=['GET'])
def redirect_url(redirectId):
    # find out todays name in M/D/Y
    today = date.today()
    formated_day = f'{today.month}/{today.day}/{today.year}'

    # find link with redirectID
    link = Link.query.filter_by(redirectId=redirectId).first_or_404()

    if link.data:
        #  link DOES exsits
        data = Data.query.filter_by(
            date=formated_day, link_id=link.id).first_or_404()
        data.clicks += 1
        db.session.commit()
        return redirect(link.link)
    else:
        # link DOES NOT exsits
        data = Data(date=formated_day, clicks=1, link=link)
        db.session.add(data)
        db.session.commit()
        return redirect(link.link)


if __name__ == '__main__':
    app.run(host='localhost', port=3001, debug=True)
