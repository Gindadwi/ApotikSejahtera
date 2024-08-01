

function Button (props){
    

    const {name, type, className, onClick, dropdown, id} = props;

    return(
        <button
        id={id}
        data-dropdown-toggle={dropdown}
        onClick={onClick}
        type={type}
            className={`bg-gradient-to-r from-Button1  to-Button2 rounded-lg text-white font-poppins text-md px-4 py-1 
            lg:px-6 lg:text-lg lg:h-[35px] ${className}`}
        >
            {name}
        </button>
    )

} 


export default Button;