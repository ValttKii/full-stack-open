const Header = (props) => {
    console.log("brr", props)
    return <h2>{props.name}</h2>
}

const Part = ({ name, exercises }) => {
    console.log("part", name)
    return <p>{name} {exercises}</p>
}

const Content = (props) => {
    console.log("C", props)

    const contentRows = props.parts.map((part, i) => {
        return <Part key={i} name={part.name} exercises={part.exercises} />
    })

    return  <div>{contentRows}</div>
}

const Total = (props) => {


    const exerSum = props.parts.reduce((s, p) => {
        return s + p.exercises
    }, 0)

    return (
        <p>
            <b>total of {exerSum} exercises</b>
        </p>
    )
}
const Course = (props) => {
    console.log("course", props)
    return (
        <div>
            <Header name={props.course.name} />
            <Content parts={props.course.parts} />
            <Total parts={props.course.parts} />
        </div>
    )
}

export default Course