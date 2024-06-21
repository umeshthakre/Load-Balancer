# Load-Balancer

## Overview
This project implements a robust load balancer backend using JavaScript. It supports four different load balancing algorithms to efficiently distribute network traffic across a pool of servers, enhancing performance, reliability, and scalability.

## Features
- **Round Robin**: Distributes client requests sequentially across servers.
- **Least Connections**: Routes traffic to the server with the fewest active connections.
- **Weighted Round Robin**: Takes server capacities into account, directing more requests to higher-capacity servers.
- **IP Hashing**: Consistently maps client IP addresses to specific servers.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Configuration](#configuration)
4. [Algorithms](#algorithms)
   - [Round Robin](#round-robin)
   - [Least Connections](#least-connections)
   - [Weighted Round Robin](#weighted-round-robin)
   - [IP Hashing](#ip-hashing)
5. [Contributing](#contributing)
6. [License](#license)

## Installation
### Prerequisites
- Node.js (v12+)
- npm (v6+)

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/umeshthakre/load-balancer.git
    cd load-balancer
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```

## Usage
1. Start the load balancer:
    ```bash
    node load_balancer.js
    ```
2. Configure the load balancing algorithm and server pool in `config.json`.

## Configuration
Modify the `config.json` file to set up your server pool and choose the desired load balancing algorithm.

## Algorithms

### Round Robin
Distributes incoming requests sequentially to each server in the list. Once the end of the list is reached, it starts over from the beginning.

### Least Connections
Routes traffic to the server with the fewest active connections. This method ensures that no single server becomes overwhelmed if others are underutilized.

### Weighted Round Robin
Similar to round robin, but takes server weights into account. Servers with higher weights receive more requests proportionally.

### IP Hashing
Uses the client's IP address to determine the server to which requests should be sent. This ensures that the same client is always directed to the same server, providing session persistence.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code follows the project's coding standards and includes appropriate tests.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Feel free to adjust this README file according to your project's specifics and any additional details you might want to include!
