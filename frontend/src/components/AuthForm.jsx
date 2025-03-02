export default function AuthForm({ email, setEmail, password, setPassword, onSubmit, isLogin, children }) {
    return (
        <div className="auth-container animate__animated animate__fadeIn">
        <div className="auth-card animate__animated animate__slideInUp">
        <form onSubmit={onSubmit}>
        <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Password</label>
            <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            />
        </div>
        
        {/* Render additional children */}
        {children}

        <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Login' : 'Continue Registration'}
        </button>
        </form>
    </div>
   </div>
    );
}